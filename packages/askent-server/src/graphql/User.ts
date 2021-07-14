import {
  Field,
  ObjectType,
  Root,
  InputType,
  Resolver,
  Mutation,
  Query,
  Arg,
  Ctx,
  ID,
} from "type-graphql";
import { getRepository, In, Repository } from "typeorm";
import { hash, compare } from "bcryptjs";
import MD5 from "crypto-js/md5";
import { Context } from "../context";
import { signToken } from "../utils";
import { Role as RoleEntity } from "../entity/Role";
import { CLAIMS_NAMESPACE, RoleName } from "../constant";
import { User as UserEntity } from "../entity/User";
import { Role } from "./Role";

@ObjectType()
export class User {
  private userRepository: Repository<UserEntity>;

  constructor() {
    this.userRepository = getRepository(UserEntity);
  }

  @Field((returns) => ID)
  public id!: string;

  @Field({ nullable: true, defaultValue: "" })
  public email?: string;

  @Field({ nullable: true, defaultValue: "" })
  public name?: string;

  @Field({ nullable: true, defaultValue: false })
  public anonymous?: boolean;

  @Field({ nullable: true, defaultValue: "" })
  public avatar?: string;

  @Field((returns) => [Role])
  async roles(@Root() root: User): Promise<RoleEntity[]> {
    const roles = await this.userRepository
      .createQueryBuilder()
      .relation(UserEntity, "roles")
      .of(root.id)
      .loadMany();

    return roles;
  }

  @Field()
  public createdAt!: Date;

  @Field()
  public updatedAt!: Date;

  @Field({ nullable: true })
  public deletedAt?: Date;
}

@ObjectType()
export class AuthPayload {
  @Field()
  public token!: string;

  @Field((returns) => User)
  public user!: UserEntity;
}

@ObjectType()
export class PGP {
  @Field()
  public pubKey!: string;
}

@InputType()
export class UpdateUserInput implements Partial<User> {
  @Field({ nullable: true })
  public name?: string;

  @Field({ nullable: true })
  public email?: string;

  @Field({ nullable: true })
  public anonymous?: boolean;
}

@Resolver((of) => User)
export class UserResolver {
  private userRepository: Repository<UserEntity>;

  constructor() {
    this.userRepository = getRepository(UserEntity);
  }

  @Query((returns) => User)
  async me(@Ctx() ctx: Context): Promise<UserEntity> {
    const user = await this.userRepository.findOneOrFail(
      ctx.user?.id as string
    );
    if (!user) {
      throw new Error();
    }

    return user;
  }

  @Query((returns) => Boolean, {
    description: "Check if a email has already exist.",
  })
  checkEmailExist(
    @Arg("email") email: string,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    return checkEmailExist(ctx, email);
  }

  @Query((returns) => PGP, { description: "For demo use" })
  pgp(): PGP {
    return { pubKey: "pgpPubKey" };
  }

  @Mutation((returns) => AuthPayload)
  async login(
    @Arg("email", { description: "User Email" }) email: string,
    @Arg("password") password: string
  ): Promise<AuthPayload> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ["roles"],
    });

    if (!user) {
      throw new Error(`No user found for email: ${email}`);
    }
    const passwordValid = await compare(password, user.password as string);
    if (!passwordValid) {
      throw new Error("Invalid password");
    }

    return {
      token: signToken({
        id: user.id,
        roles: user.roles.map((role) => role.name),
        [CLAIMS_NAMESPACE]: {
          "x-hasura-user-id": user.id,
          "x-hasura-default-role": user.roles.map((role) => role.name)[0],
          "x-hasura-allowed-roles": user.roles.map((role) => role.name),
        },
      }),
      user: user,
    };
  }

  @Mutation((returns) => AuthPayload, {
    description: `Audience 登陆。
  若 fingerprint 的 User 已存在则返回 token，
  若 fingerprint 的 User 不存在则 create 并返回 token`,
  })
  async loginAudience(
    @Arg("fingerprint") fingerprint: string
  ): Promise<AuthPayload> {
    let user = await this.userRepository.findOne({ fingerprint });
    const roleNames: Array<RoleName> = [RoleName.Audience];
    if (!user) {
      const roles = await getRepository(RoleEntity).find({
        where: { name: In(roleNames) },
      });
      user = this.userRepository.create({ fingerprint, roles });
      await this.userRepository.save(user);
    }

    return {
      token: signToken({
        id: user.id as string,
        roles: roleNames,
        [CLAIMS_NAMESPACE]: {
          "x-hasura-user-id": user.id,
          "x-hasura-default-role": roleNames[0],
          "x-hasura-allowed-roles": roleNames,
        },
      }),
      user: user,
    };
  }

  @Mutation((returns) => AuthPayload, { description: "Signup a new user." })
  async signup(
    @Arg("name", { description: "User name" }) name: string,
    @Arg("email", { description: "User Email" }) email: string,
    @Arg("password") password: string
  ): Promise<AuthPayload> {
    const hashedPassword = await hash(password, 10);
    const roleNames: Array<RoleName> = [RoleName.User, RoleName.Audience];
    const roles = await getRepository(RoleEntity).find({
      where: { name: In(roleNames) },
    });
    const user = this.userRepository.create({
      name,
      email,
      avatar: getGravatar(email),
      password: hashedPassword,
      roles,
    });
    await this.userRepository.save(user);

    return {
      token: signToken({
        id: user.id as string,
        roles: roleNames,
        [CLAIMS_NAMESPACE]: {
          "x-hasura-user-id": user.id,
          "x-hasura-default-role": roleNames[0],
          "x-hasura-allowed-roles": roleNames,
        },
      }),
      user: user,
    };
  }

  @Mutation((returns) => User)
  async updateUser(
    @Arg("input") input: UpdateUserInput,
    @Ctx() ctx: Context
  ): Promise<UserEntity> {
    const userId = ctx.user?.id as string;
    let user = await this.userRepository.findOneOrFail(userId);
    if (input.name === "" && input.anonymous) {
      user.anonymous = input.anonymous;
    } else {
      user = Object.assign(
        user,
        typeof input.name === "string" ? { name: input.name } : {},
        typeof input.email === "string"
          ? { email: input.email, avatar: getGravatar(input.email) }
          : {},
        typeof input.anonymous === "boolean"
          ? { anonymous: input.anonymous }
          : {}
      );
    }
    await this.userRepository.save(user);

    return user;
  }
}

async function checkEmailExist(ctx: Context, email: string): Promise<boolean> {
  return Boolean(await getRepository(UserEntity).count({ where: { email } }));
}

function getGravatar(email: string): string {
  if (email) {
    const emailMD5Hash = MD5(email.trim().toLowerCase()).toString();
    return (
      "https://www.gravatar.com/avatar/" + `${emailMD5Hash}?s=${40}&d=retro`
    );
  } else {
    return "";
  }
}

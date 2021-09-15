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
  Args,
  ArgsType,
} from "type-graphql";
import { getRepository, In, Repository } from "typeorm";
import { hash, compare } from "bcryptjs";
import MD5 from "crypto-js/md5";
import { Context } from "../context";
import { signToken } from "../utils";
import { Role as RoleEntity } from "../entity/Role";
import { Role } from "./Role";
import { User as UserEntity } from "../entity/User";
import { CLAIMS_NAMESPACE, RoleName } from "../constant";
import {
  USER_NAME_MAX_LENGTH,
  USER_PASSWORD_MAX_LENGTH,
  USER_EMAIL_MAX_LENGTH,
} from "askent-common/src/constant";
import { IsEmail, MaxLength } from "class-validator";

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

  @Field({ nullable: true, defaultValue: true })
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
class AuthPayload {
  @Field()
  public token!: string;

  @Field((returns) => User)
  public user!: UserEntity;
}

@ObjectType()
class PGP {
  @Field()
  public pubKey!: string;
}

@ArgsType()
class checkEmailExistArgs {
  @Field((type) => String)
  @IsEmail()
  email!: string;
}

@InputType()
class UpdateUserInput implements Partial<User> {
  @Field((type) => String, { nullable: true })
  @MaxLength(USER_NAME_MAX_LENGTH)
  public name?: string;

  @Field((type) => String, { nullable: true })
  @IsEmail()
  @MaxLength(USER_EMAIL_MAX_LENGTH)
  public email?: string;

  @Field((type) => Boolean, { nullable: true, defaultValue: true })
  public anonymous?: boolean;
}

@ArgsType()
class LoginArgsType {
  @Field((type) => String, { description: "User Email" })
  @IsEmail()
  @MaxLength(USER_EMAIL_MAX_LENGTH)
  email!: string;

  @Field((type) => String)
  @MaxLength(USER_PASSWORD_MAX_LENGTH)
  password!: string;
}

@ArgsType()
class SignupArgsType {
  @Field((type) => String, { description: "User name" })
  @MaxLength(USER_NAME_MAX_LENGTH)
  name!: string;

  @Field((type) => String, { description: "User Email" })
  @IsEmail()
  @MaxLength(USER_EMAIL_MAX_LENGTH)
  email!: string;

  @Field((type) => String)
  @MaxLength(USER_PASSWORD_MAX_LENGTH)
  password!: string;
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
    @Args() { email }: checkEmailExistArgs,
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
    @Args() { email, password }: LoginArgsType
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
    @Args() { name, email, password }: SignupArgsType
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
    if (typeof input.name === "string") {
      user.name = input.name;
      user.anonymous = input.name === "";
    }
    if (typeof input.email === "string") {
      user.email = input.email;
      user.avatar = getGravatar(input.email);
    }
    if (typeof input.anonymous === "boolean") {
      user.anonymous = input.anonymous;
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

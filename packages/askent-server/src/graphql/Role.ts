import {
  Field,
  ObjectType,
  Resolver,
  Mutation,
  Query,
  Arg,
  ID,
} from 'type-graphql'
import { RoleName } from '../constant'
import { getRepository, Repository } from 'typeorm'
import { Role as RoleEneity } from '../entity/Role'

@ObjectType()
export class Role {
  @Field((returns) => ID)
  public id!: string

  @Field()
  public name!: string
}

@Resolver((of) => Role)
export class RoleResolver {
  private roleRepository: Repository<RoleEneity>

  constructor() {
    this.roleRepository = getRepository(RoleEneity)
  }

  @Query((returns) => [Role])
  async roles(): Promise<RoleEneity[]> {
    const roles = await this.roleRepository.find()
    return roles
  }

  @Mutation((returns) => Role)
  createRole(@Arg('name', (type) => RoleName) name: RoleName): Promise<Role> {
    const role = this.roleRepository.create({ name })
    return this.roleRepository.save(role)
  }
}

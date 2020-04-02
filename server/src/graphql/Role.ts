import {
  Field,
  ObjectType,
  registerEnumType,
  Resolver,
  Mutation,
  Query,
  Arg,
  ID,
} from 'type-graphql'
import { RoleName } from '../entity/Role'
import { getRepository, Repository } from 'typeorm'
import { Role as RoleEneity } from '../entity/Role'
import { plainToClass } from 'class-transformer'

registerEnumType(RoleName, {
  name: 'RoleName',
})

@ObjectType()
export class Role {
  @Field(returns => ID)
  public id!: string

  @Field()
  public name!: string
}

@Resolver(of => Role)
export class RoleResolver {
  private roleRepository: Repository<RoleEneity>

  constructor() {
    this.roleRepository = getRepository(RoleEneity)
  }
  
  @Query(returns => [Role])
  async roles(): Promise<Role[]> {
    const roles = await this.roleRepository.find()
    return plainToClass(Role, roles)
  }

  @Mutation(returns => Role)
  createRole(@Arg('name', type => RoleName) name: RoleName): Promise<Role> {
    const role = this.roleRepository.create({ name })
    return this.roleRepository.save(role)
  }
}

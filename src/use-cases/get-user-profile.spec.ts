/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let userRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(userRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await userRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: '123456',
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.name).toEqual('John Doe')
    expect(user.email).toEqual('john.doe@example.com')
  })

  it('should not be able to get user profile with wrong id', async () => {
    expect(async () => {
      await sut.execute({
        userId: 'non-existing-id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

import { ConfigurationService } from '@ghostfolio/api/services/configuration.service';
import { PrismaService } from '@ghostfolio/api/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { AuthDevice, Prisma } from '@prisma/client';

@Injectable()
export class AuthDeviceService {
  public constructor(
    private readonly configurationService: ConfigurationService,
    private prisma: PrismaService
  ) {}

  public async authDevice(
    where: Prisma.AuthDeviceWhereUniqueInput
  ): Promise<AuthDevice | null> {
    return this.prisma.authDevice.findUnique({
      where
    });
  }

  public async authDevices(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AuthDeviceWhereUniqueInput;
    where?: Prisma.AuthDeviceWhereInput;
    orderBy?: Prisma.AuthDeviceOrderByInput;
  }): Promise<AuthDevice[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.authDevice.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy
    });
  }

  public async createAuthDevice(
    data: Prisma.AuthDeviceCreateInput
  ): Promise<AuthDevice> {
    return this.prisma.authDevice.create({
      data
    });
  }

  public async updateAuthDevice(params: {
    data: Prisma.AuthDeviceUpdateInput;
    where: Prisma.AuthDeviceWhereUniqueInput;
  }): Promise<AuthDevice> {
    const { data, where } = params;

    return this.prisma.authDevice.update({
      data,
      where
    });
  }

  public async deleteAuthDevice(
    where: Prisma.AuthDeviceWhereUniqueInput
  ): Promise<AuthDevice> {
    return this.prisma.authDevice.delete({
      where
    });
  }
}
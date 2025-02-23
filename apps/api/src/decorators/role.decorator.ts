import { UserRolesEnum } from '@makefilm/contracts';
import { applyDecorators, SetMetadata } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const Roles = (...roles: UserRolesEnum[]) => applyDecorators(SetMetadata('RoleMetadataKey', roles));

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export default class BaseDto {
  @ApiProperty({
    description: 'Criation date',
    example: '2021-10-14T01:43:00.658Z',
  })
  @IsOptional()
  @IsString()
  createdAt?: Date;

  @ApiProperty({
    description: 'Update date',
    example: '2021-10-14T01:43:00.658Z',
  })
  @IsOptional()
  @IsString()
  updatedAt?: Date;

  @ApiProperty({
    description: 'Tenant Id',
    example: '3f620513-42bd-4670-a731-e80c939ed9e4',
  })
  @IsOptional()
  @IsUUID()
  tenantid?: string;

  @ApiProperty({
    description: 'Branch Id',
    example: '3f620513-42bd-4670-a731-e80c939ed9e4',
  })
  @IsOptional()
  @IsUUID()
  branchid?: string;
}

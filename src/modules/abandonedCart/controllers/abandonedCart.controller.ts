import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  NotImplementedException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationParamsDto } from '../../../common/dto/pagination.dto';
import { AbandonedCartService } from '../services/abandonedCart.service';
import { HotmartAbandonedCartPayload } from '../dto/response/hotmart-payload';

@Controller('abandoned-cart')
export class AbandonedCartController {
  constructor(private readonly eventsService: AbandonedCartService) {}

  @Post('webhook')
  async create(@Body() payload: HotmartAbandonedCartPayload) {
    return await this.eventsService.create(payload);
  }

  @Get()
  findAll(@Query() paginationParams: PaginationParamsDto) {
    return this.eventsService.findAll({
      limit: paginationParams.limit,
      page: paginationParams.page,
      orderByField: paginationParams.orderByField,
      orderByDirection: paginationParams.orderByDirection,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const userFound = await this.eventsService.findOne(id);
    if (!userFound) throw new NotFoundException('User not found!');
    return userFound;
  }

  @Get('/bi/abandoned-regions')
  async abandonedRegions(@Query() paginationParams: PaginationParamsDto) {
    return await this.eventsService.getAbandonedRegions({
      limit: paginationParams.limit,
      page: paginationParams.page,
      orderByField: paginationParams.orderByField,
      orderByDirection: paginationParams.orderByDirection,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id?: string,
    @Body() updateAbandonedCartEvent?: any,
  ) {
    return new NotImplementedException('Endpoint not implemented!');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return new NotImplementedException('Endpoint not implemented!');
  }
}

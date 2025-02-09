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
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { PaginationParamsDto } from '../../../common/dto/pagination.dto';
import { AbandonedCartService } from '../services/abandonedCart.service';
import { HotmartAbandonedCartPayload } from '../dto/response/hotmart-payload';
import { JwtInterceptor } from 'src/system/interceptors/jwt.interceptor';

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
  @UseInterceptors(JwtInterceptor)
  @Get('/bi/abandoned-regions')
  async abandonedRegions(@Query() paginationParams: PaginationParamsDto) {
    return await this.eventsService.getAbandonedRegions({
      limit: paginationParams.limit,
      page: paginationParams.page,
      orderByField: paginationParams.orderByField,
      orderByDirection: paginationParams.orderByDirection,
    });
  }

  @UseInterceptors(JwtInterceptor)
  @Get('/bi/abandoned-products')
  async abandonedProducts(@Req() request) {
    const { branchId, tenantid, _ } = request.customer;

    return await this.eventsService.getAbandonedProducts({
      where: { branchId, tenantid },
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

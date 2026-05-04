import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CitasService } from './citas.service';

@UseGuards(AuthGuard('jwt'))
@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.citasService.findAllByUser(req.user);
  }

  @Post()
  create(
    @Body()
    body: {
      fechaHora: string;
      pacienteId?: number;
      profesionalId: number;
    },
    @Req() req: any,
  ) {
    return this.citasService.create(body, req.user);
  }
}
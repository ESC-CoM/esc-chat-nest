import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get()
  public health() {
    return true;
  }
}

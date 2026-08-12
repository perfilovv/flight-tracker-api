import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RateLimitGuard } from 'src/shared/guards/rate-limit.guard';
import { RateLimit } from 'src/shared/decorators/rate-limit.decorator';

@Controller('auth')
@UseGuards(RateLimitGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  @RateLimit({ points: 3, duration: 3600 })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @RateLimit({ points: 5, duration: 300 })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}

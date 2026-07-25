import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { usersTable } from 'src/database/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DRIZZLE') private readonly db: NodePgDatabase,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const [existing] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, dto.email));

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const [user] = await this.db
      .insert(usersTable)
      .values({ email: dto.email, passwordHash })
      .returning({ id: usersTable.id, email: usersTable.email });

    const token = await this.jwtService.signAsync(
      {
        id: user.id,
        email: user.email,
      },
      {
        expiresIn: '7d',
      },
    );

    return { token, user };
  }

  async login(dto: LoginDto) {
    const [user] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, dto.email));

    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!valid) {
      throw new NotFoundException('Invalid credentials');
    }

    const token = await this.jwtService.signAsync(
      {
        id: user.id,
        email: user.email,
      },
      {
        expiresIn: '7d',
      },
    );

    return { token };
  }
}

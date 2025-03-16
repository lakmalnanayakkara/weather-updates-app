import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'IS_PUBLIC_KEY',
      context.getHandler(),
    );
    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);
    if (isPublic) {
      return true;
    }

    if (!token) {
      throw new UnauthorizedException('Unauthorized access1', {
        cause: new Error(),
        description: 'Unauthorized access1',
      });
    }
    try {
      const payload = this.authService.validateToken(token);
      req.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message, {
        cause: new Error(),
        description: 'Unauthorized access2',
      });
    }

    return false;
  }

  private extractTokenFromHeader(request): string | null {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
      return authHeader.split(' ')[1];
    }
    return null;
  }
}

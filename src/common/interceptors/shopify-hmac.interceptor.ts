// src/common/interceptors/shopify-hmac.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UnauthorizedException, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as crypto from 'crypto'; // Importe o módulo crypto do Node.js
import { ConfigService } from '@nestjs/config'; // Para acessar variáveis de ambiente

@Injectable() // Marca a classe como um provedor injetável
export class ShopifyHmacInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ShopifyHmacInterceptor.name);
  constructor(private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const shopifyHmac = request.headers['x-shopify-hmac-sha256'];
    const rawBody = request.rawBody;
    const secret = this.configService.get<string>('SHOPIFY_API_SECRET');

    this.logger.debug(`Shopify HMAC Recebido: ${shopifyHmac}`);
    this.logger.debug(`Corpo Bruto Recebido: ${rawBody ? rawBody.substring(0, 100) + '...' : 'Nulo'}`);
    this.logger.debug(`Chave Secreta: ${secret ? 'Presente' : 'Ausente'}`);

    if (!shopifyHmac || !rawBody || !secret) {
      this.logger.error('Validação HMAC falhou: HMAC, corpo bruto ou chave secreta ausentes.');
      throw new UnauthorizedException('Missing Shopify HMAC, raw body, or webhook secret.');
    }

    const hmac = crypto
      .createHmac('sha256', secret) // Usa o algoritmo SHA256 e sua chave secreta
      .update(rawBody, 'utf8')      // Atualiza o hash com o corpo bruto (codificado em UTF-8)
      .digest('base64');            // Converte o hash resultante para base64

    this.logger.debug(`HMAC Gerado Localmente: ${hmac}`);

    if (hmac !== shopifyHmac) {
      this.logger.error('Validação HMAC falhou: Assinatura inválida.');
      throw new UnauthorizedException('Invalid Shopify HMAC signature.');
    }

    this.logger.log('Validação HMAC da Shopify bem-sucedida!');
    return next.handle();
  }
}
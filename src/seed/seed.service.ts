import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductImage } from 'src/product/entities';
import { Repository } from 'typeorm';
import { initialData } from './seed-data';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async runSeed() {
    await this.deleteAllProducts();
    await this.insertNewProducts();

    return 'Seed Executed';
  }

  private async insertNewProducts() {
    const { products } = initialData;

    const insertedProducts = products.map(({ images, ...productDetails }) => {
      const insertedProduct = this.productRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });
      return this.productRepository.save(insertedProduct);
    });

    await Promise.all(insertedProducts);
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    return await query.delete().where({}).execute();
  }
}

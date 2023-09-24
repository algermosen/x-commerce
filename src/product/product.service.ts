import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product, ProductImage } from './entities';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { isUUID } from 'src/common/uuid';

@Injectable()
export class ProductService {
  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });

      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll({ skip, take = 5 }: PaginationDto) {
    const products = await this.productRepository.find({
      skip,
      take,
    });

    return products.map((product) => ({
      ...product,
      images: product.images.map((image) => image.url),
    }));
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({
        id: term,
      });
    } else {
      product = await this.productRepository.findOneBy({
        slug: term,
      });
    }

    if (!product)
      throw new NotFoundException(`Not Product with '${term}' could be found`);

    return product;
  }

  async findOneAndFlat(term: string) {
    const { images, ...details } = await this.findOne(term);
    return { details, images: images.map((image) => image.url) };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({
      id,
      ...toUpdate,
    });

    if (!product)
      throw new NotFoundException(`Not Product with id '${id}' could be found`);

    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      if (images) {
        queryRunner.manager.delete(ProductImage, { product: { id } });

        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      }

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();

      return product;
    } catch (error) {
      queryRunner.rollbackTransaction();
      this.handleExceptions(error);
    } finally {
      queryRunner.release();
    }
  }

  async remove(id: string) {
    const { affected } = await this.productRepository.delete(id);

    if (!affected) {
      throw new NotFoundException(`Product with id '${id}' could not be found`);
    }
  }

  private handleExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    throw new InternalServerErrorException(
      `Unexpected error, check logs.${
        error.code && ' Error code: [' + error.code + ']'
      }`,
    );
  }
}

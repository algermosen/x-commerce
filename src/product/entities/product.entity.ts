import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { ProductImage } from './';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  @Column({
    type: 'float',
    default: 0,
  })
  price: number;

  @Column('text')
  description: string;

  @Column('text', {
    unique: true,
  })
  slug: string;

  @Column('int', {
    default: 0,
  })
  stock: number;

  @Column('text', {
    array: true,
  })
  sizes: string[];

  @Column()
  gender: string;

  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  sanitizeSlug() {
    this.slug = this.slug
      .toLocaleLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeInsert()
  executeBeforeInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.sanitizeSlug();
  }

  @BeforeUpdate()
  executeBeforeUpdate() {
    this.sanitizeSlug();
  }
}

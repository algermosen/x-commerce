import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    length: 30,
  })
  title: string;

  @Column({
    type: 'float',
    default: 0,
  })
  price: number;

  @Column({
    length: 280,
    default: '',
  })
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

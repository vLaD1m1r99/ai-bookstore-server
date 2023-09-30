import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/books/entities/book.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentRepo.create(createCommentDto);
    const createdComment = await this.commentRepo.save(comment);

    const book = await this.bookRepo.findOne({
      relations: ['ratings'],
      where: { id: createCommentDto.bookId },
    });

    if (!book) {
      throw new NotFoundException(`Book not found!`);
    }

    book.comments.push(createdComment);
    await this.bookRepo.save(book);

    return createdComment;
  }

  async findOne(id: string): Promise<Comment | null> {
    const comment = await this.commentRepo.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment not found!`);
    }
    return comment;
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentRepo.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment not found!`);
    }

    if (updateCommentDto.text) {
      comment.text = updateCommentDto.text;
    }

    const book = await this.bookRepo.findOne({
      relations: ['comments'],
      where: { id: comment.book },
    });

    if (!book) {
      throw new NotFoundException(`Book not found!`);
    }

    const commentToUpdateIndex = book.comments.findIndex(
      (c) => c.id === comment.id,
    );

    if (commentToUpdateIndex === -1) {
      throw new NotFoundException(`Comment not found in book's comments!`);
    }

    book.comments[commentToUpdateIndex] = comment;
    await this.bookRepo.save(book);

    return await this.commentRepo.save(comment);
  }

  async remove(id: string): Promise<Comment> {
    const comment = await this.commentRepo.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment not found!`);
    }

    const book = await this.bookRepo.findOne({
      relations: ['comments'],
      where: { id: comment.book },
    });

    if (!book) {
      throw new NotFoundException(`Book not found!`);
    }

    book.comments = book.comments.filter((c) => c.id !== id);

    await this.bookRepo.save(book);

    return await this.commentRepo.remove(comment);
  }
}

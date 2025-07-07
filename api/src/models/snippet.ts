import mongoose, { Schema, Document, Types } from 'mongoose';
import { Snippet as SnippetType } from '../../types';
import { config } from '../../config';

export interface ISnippet extends Omit<SnippetType, 'id'>, Document {
  user: Types.ObjectId;
}

const SnippetSchema = new Schema<ISnippet>(
  {
    text: { type: String, required: true },
    summary: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return v.trim().split(/\s+/).length <= config.wordLimit;
        },
        message: (props: any) =>
          `Summary must be ${config.wordLimit} words or fewer, but got ${props.value.trim().split(/\s+/).length}.`,
      },
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export const Snippet = mongoose.model<ISnippet>('Snippet', SnippetSchema);

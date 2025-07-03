import mongoose, { Schema, Document, Types } from 'mongoose';
import { Snippet as SnippetType } from '../../types';

export interface ISnippet extends SnippetType, Document {
  user: Types.ObjectId;
}

const SUMMARY_COUNT = Number(process.env.SUMMARY_COUNT) || 30;

const SnippetSchema = new Schema<ISnippet>(
  {
    text: { type: String, required: true },
    summary: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return v.trim().split(/\s+/).length <= SUMMARY_COUNT;
        },
        message: (props: any) =>
          `Summary must be ${SUMMARY_COUNT} words or fewer, but got ${props.value.trim().split(/\s+/).length}.`,
      },
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export const Snippet = mongoose.model<ISnippet>('Snippet', SnippetSchema);

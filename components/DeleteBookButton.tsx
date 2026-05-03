'use client';

import React, { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteBook } from '@/lib/actions/book.actions';
import { toast } from 'sonner';

interface DeleteBookButtonProps {
    slug: string;
}

const DeleteBookButton = ({ slug }: DeleteBookButtonProps) => {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to the book page

        if (confirm("Are you sure you want to remove this book? This action cannot be undone.")) {
            startTransition(async () => {
                try {
                    const result = await deleteBook(slug);
                    if (result.success) {
                        toast.success("Book removed successfully");
                    } else {
                        toast.error(result.error as string || "Failed to remove book");
                    }
                } catch (error) {
                    toast.error("Something went wrong");
                }
            });
        }
    };

    return (
        <button 
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-red-50 text-red-500 rounded-full transition-colors z-10 shadow-sm disabled:opacity-50"
            aria-label="Remove book"
        >
            <Trash2 size={16} />
        </button>
    );
};

export default DeleteBookButton;
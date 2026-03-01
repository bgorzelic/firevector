'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ObservationForm } from '@/components/observation-form';
import { updateObservation, deleteObservation } from '@/lib/actions/observations';
import type { ObservationFormValues } from '@/lib/validations/observation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2, Trash2 } from 'lucide-react';

interface EditObservationClientProps {
  userId: string;
  observationId: string;
  incidentName: string;
  initialData: ObservationFormValues;
}

export function EditObservationClient({
  userId,
  observationId,
  incidentName,
  initialData,
}: EditObservationClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleSubmit = async (data: ObservationFormValues) => {
    await updateObservation(userId, observationId, data);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteObservation(userId, observationId);
    if (result.success) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Edit Observation</h1>
          <p className="mt-1 text-sm text-muted-foreground">{incidentName || 'Unnamed'}</p>
        </div>
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10">
              <Trash2 className="mr-1.5 size-4" />
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete observation?</DialogTitle>
              <DialogDescription>
                This will permanently delete &ldquo;{incidentName || 'Unnamed'}&rdquo; and all
                associated log entries. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete observation'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <ObservationForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
}

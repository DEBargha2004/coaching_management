import { GroupEntrySchemaType } from "@/schema/entry-form/group";
import { UseFormReturn } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

export default function GroupEntryForm({
  form,
  onSubmit,
  buttonLabel = "Create",
}: {
  form: UseFormReturn<GroupEntrySchemaType, any, undefined>;
  onSubmit: (data: GroupEntrySchemaType) => void;
  buttonLabel?: string;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <Input placeholder="Enter name" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <Input placeholder="Enter description" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full">
          {form.formState.isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {buttonLabel}
        </Button>
      </form>
    </Form>
  );
}

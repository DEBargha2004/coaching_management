"use client";

import { BatchEntrySchemaType } from "@/schema/entry-form/batch";
import { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { GroupType } from "@/types/group-type";

export default function BatchEntryForm({
  form,
  onSubmit,
  groups,
  button_label,
}: {
  form: UseFormReturn<BatchEntrySchemaType, any, undefined>;
  onSubmit: (data: BatchEntrySchemaType) => void;
  groups: GroupType[];
  button_label?: string;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="batch_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Batch Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter batch name" {...field} />
              </FormControl>
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
              <FormControl>
                <Input placeholder="Add description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="medium"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medium</FormLabel>
              <FormControl>
                <Input placeholder="Add medium" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="group_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((g) => (
                      <SelectItem key={g.group_id} value={g.group_id}>
                        {g.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full">
          {form.formState.isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {button_label || "Create"}
        </Button>
      </form>
    </Form>
  );
}

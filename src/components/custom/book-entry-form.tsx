import { UseFormReturn } from "react-hook-form";
import { BookEntrySchemaType } from "@/schema/entry-form/book";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { GroupType } from "@/types/group-type";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Loader2, Trash } from "lucide-react";
import { useRef, useState } from "react";
import { Label } from "../ui/label";
import Image from "next/image";
import { ImageFile } from "@/types/miscellaneous";

export const BookEntryForm = ({
  form,
  onSubmit,
  groups,
  buttonLabel,
  bookImageUrl,
}: {
  form: UseFormReturn<BookEntrySchemaType, any, undefined>;
  onSubmit: (
    data: BookEntrySchemaType & { image?: ImageFile }
  ) => Promise<void>;
  groups: GroupType[];
  buttonLabel?: string;
  bookImageUrl?: string;
}) => {
  const [image, setImage] = useState<
    { file: ImageFile } & { url: string | null }
  >({
    url: bookImageUrl || null,
    file: null,
  });
  const ImageInputRef = useRef<HTMLInputElement>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files?.length) {
      fileReader.readAsDataURL(e.target.files[0]);
    }
    fileReader.onload = () => {
      setImage({
        url: fileReader.result as string,
        file: e.target.files?.[0] || null,
      });
    };
  };
  const handleDeleteImage = () => {
    setImage({
      url: null,
      file: null,
    });
    if (ImageInputRef.current) {
      ImageInputRef.current.value = "";
    }
  };
  return (
    <Form {...form}>
      <div className="w-full  rounded-lg overflow-hidden">
        {image.url ? (
          <div className="group relative w-full aspect-[2/1] flex justify-center items-center">
            <Image
              src={image.url || ""}
              alt="book image"
              className="h-full w-fit "
              width={200}
              height={100}
            />
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
              opacity-0 group-hover:opacity-50 h-10 w-10 bg-red-500 z-20 
              flex justify-center items-center rounded-full cursor-pointer transition-all`}
              onClick={handleDeleteImage}
            >
              <Trash />
            </div>
          </div>
        ) : (
          <div className="w-full aspect-[2/1] bg-muted border-2 border-primary border-dashed rounded-lg" />
        )}
      </div>
      <form
        onSubmit={form.handleSubmit(async (fieldValues) => {
          await onSubmit({ ...fieldValues, image: image.file });
        })}
        className="space-y-4"
      >
        <div className="space-y-4">
          <Label>Book Image</Label>
          <Input
            type="file"
            onChange={handleImageChange}
            ref={ImageInputRef}
            accept="image/*"
          />
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="group"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {groups.map((g) => (
                      <SelectItem key={g.group_id} value={g.group_id}>
                        {g.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other</FormLabel>
              <FormControl>
                <Input placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {buttonLabel || "Create"}
        </Button>
      </form>
    </Form>
  );
};

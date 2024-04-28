"use client";

import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  teacherBoardList,
  teachersLimitPerBoard,
} from "@/constants/teacher-board";
import { cn } from "@/lib/utils";
import { useTeachersStore } from "@/store/teachers-store";
import { useUser } from "@clerk/nextjs";
import { Edit2, Grip, Loader2, Trash2, User2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useThrottle } from "@uidotdev/usehooks";
import { useForm } from "react-hook-form";
import {
  teacherEntrySchema,
  TeacherEntrySchemaType,
} from "@/schema/entry-form/teacher";
import { zodResolver } from "@hookform/resolvers/zod";
import TeacherEntryForm from "@/components/custom/teacher-entry-form";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { membership_statuses } from "@/constants/membership-status";
import { useSearchParams } from "next/navigation";
import PaginationBar from "@/components/custom/pagination-bar";
import { isNumber } from "lodash";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HighlightWrapper,
  UnderlineWrapper,
} from "@/components/custom/text-wrappers";
import getTeacherInfoEntryForm, {
  addTeacher,
  changeTeacherInfo,
  deleteTeacher,
  getTeachers,
  getTeachersCount,
} from "@/server-actions/teacher";

export default function Page() {
  const [search, setSearch] = useState("");
  const [sortParam, setSortParam] = useState("");
  const throttledSearch = useThrottle(search, 500);
  const throttledSortParam = useThrottle(sortParam, 500);
  const searchParams = useSearchParams();
  const [pageInfo, setPageInfo] = useState<{ active_page: number | null }>({
    active_page: null,
  });

  const [dialogBoxState, setDialogBoxState] = useState({
    teacher_entry_form: false,
    delete_teacher: false,
    edit_teacher_form: false,
  });
  const [loading, setLoading] = useState({
    teachers: true,
    delete_teacher: false,
    teacher_info: false,
  });
  const [dropdownState, setDropdownState] = useState({
    action: {
      teacher_id: "",
    },
  });

  const [contextMenuState, setContextMenuState] = useState({
    action: {
      teacher_id: "",
    },
  });
  const { toast } = useToast();

  const {
    teachers_board,
    teachers_count,
    setTeachersBoard,
    alterTeachersBoard,
    setTeachersCount,
  } = useTeachersStore();
  const { user } = useUser();

  const form = useForm<TeacherEntrySchemaType>({
    resolver: zodResolver(teacherEntrySchema),
    defaultValues: {
      qualifications: [
        {
          courseType: "",
          courseName: "",
          collegeName: "",
          major: "",
          endDate: "",
          startDate: "",
        },
      ],
    },
  });

  const sortParamsList = useMemo(() => {
    return [{ name: "Salary", value: "salary" }] as {
      name: string;
      value: string;
    }[];
  }, []);

  const handleFormSubmit = async (data: TeacherEntrySchemaType) => {
    const serverMessage_addTeacher = await addTeacher(data);
    setDialogBoxState((prev) => ({ ...prev, teacher_entry_form: false }));
    alterTeachersBoard((prev) => {
      prev.teachers_board.unshift(...(serverMessage_addTeacher.result || []));
    });
    toast({
      title: serverMessage_addTeacher.heading,
      description: serverMessage_addTeacher.description,
      variant:
        serverMessage_addTeacher.status === "success"
          ? "default"
          : "destructive",
    });
    form.reset();
  };

  const handleDeleteTeacher = async (id: string) => {
    setLoading((prev) => ({ ...prev, delete_teacher: true }));
    const serverMessage = await deleteTeacher(id);
    setLoading((prev) => ({ ...prev, delete_teacher: false }));
    toast({
      title: serverMessage.heading,
      description: serverMessage.description,
      variant: serverMessage.status === "success" ? "default" : "destructive",
    });
    if (serverMessage.status === "success") {
      alterTeachersBoard((teachers) => {
        teachers.teachers_board = teachers.teachers_board.filter(
          (teacher) => teacher.teacher_id !== id
        );
      });
    }
    setDialogBoxState((prev) => ({ ...prev, delete_teacher: false }));
  };

  const handleGetTeacherInfo = async (teacher_id: string) => {
    setLoading((prev) => ({ ...prev, teacher_info: true }));
    const teacher_info = await getTeacherInfoEntryForm(teacher_id);
    console.log(teacher_info);
    if (teacher_info.status === "error") {
      toast({
        variant: "destructive",
        title: teacher_info.heading,
        description: teacher_info.description,
      });
    } else {
      form.setValue("firstName", teacher_info.result?.firstName || "");

      setLoading((prev) => ({ ...prev, teacher_info: false }));
    }
  };

  const handleMembershipStatus = async ({
    teacher_id,
    status,
  }: {
    teacher_id: string;
    status: string;
  }) => {
    const prev_status = teachers_board.find(
      (t) => t.teacher_id === teacher_id
    )?.membership_status;

    if (prev_status === status) {
      return toast({
        title: "No change",
        description: `The teacher's membership status is already ${status}.`,
        variant: "default",
      });
    }

    if (prev_status) {
      alterTeachersBoard((prev) => {
        prev.teachers_board.map((teacher) => {
          if (teacher.teacher_id === teacher_id) {
            teacher.membership_status = "Loading";
          }
        });
      });

      const res = await changeTeacherInfo({
        teacher_id,
        data: { membershipStatus: status },
      });

      alterTeachersBoard((prev) => {
        prev.teachers_board.map((teacher) => {
          if (teacher.teacher_id === teacher_id) {
            teacher.membership_status =
              res.status === "success"
                ? res?.result?.membershipStatus || prev_status
                : prev_status;
          }
        });
      });

      toast({
        title: res.heading,
        description: res.description,
        variant: res.status === "success" ? "default" : "destructive",
      });
    }
  };

  useEffect(() => {
    if (user?.id) {
      setLoading((prev) => ({ ...prev, teachers: true }));
      const activePage = searchParams.get("p");
      const activePage_num = activePage
        ? isNumber(Number(activePage))
          ? Number(activePage)
          : 1
        : 1;
      getTeachers({
        search: throttledSearch,
        sortParam: throttledSortParam,
        offset: activePage_num
          ? (activePage_num - 1) * teachersLimitPerBoard
          : 0,
      }).then((data) => {
        setTeachersBoard(data);
        setLoading((prev) => ({ ...prev, teachers: false }));
      });
    }
  }, [user, throttledSearch, throttledSortParam, searchParams]);

  useEffect(() => {
    if (user?.id) {
      getTeachersCount().then((count) =>
        setTeachersCount(count ? count[0]?.count : 0)
      );

      const activePage = Number(searchParams.get("p"));
      const activePage_num = isNumber(activePage) ? activePage : 1;
      setPageInfo((prev) => ({ ...prev, active_page: activePage_num }));
    }
  }, [user]);

  console.log(teachers_board);

  return (
    <main className="h-full w-full">
      <div className="flex justify-between items-center gap-10 h-[10%]">
        <div className="w-2/3 flex justify-start items-center gap-5">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn("w-1/2 shrink-0 grow-0", !search && "italic")}
            placeholder="Search Teachers..."
          />
          <Select value={sortParam} onValueChange={setSortParam}>
            <SelectTrigger className="w-1/4 shrink-0 grow-0">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortParamsList.map((item, index) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog
          onOpenChange={(e) => {
            setDialogBoxState((prev) => ({ ...prev, teacher_entry_form: e }));
            form.reset();
          }}
          open={dialogBoxState.teacher_entry_form}
        >
          <DialogTrigger asChild>
            <Button>
              <User2 className="mr-2 h-4 w-4" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className="">
            <DialogHeader>Teacher Entry Form</DialogHeader>
            <TeacherEntryForm form={form} onSubmit={handleFormSubmit} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="h-[90%] max-h-fit pt-12 pb-8 flex flex-col justify-between items-center">
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="border">sl no.</TableHead>
              {teacherBoardList.map((item, index) => (
                <TableHead key={index} className="border">
                  {item.name}
                </TableHead>
              ))}
              <TableHead className="border">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading.teachers
              ? Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="border">
                    <TableCell className="border">
                      <Skeleton className="h-6 w-6" />
                    </TableCell>
                    {teacherBoardList.map((item, index) => (
                      <TableCell key={index} className="border">
                        <Skeleton className="h-6 w-auto" />
                      </TableCell>
                    ))}
                    <TableCell className="border cursor-pointer">
                      <Skeleton className="h-6 w-10" />
                    </TableCell>
                  </TableRow>
                ))
              : teachers_board?.map((teacher, teacher_idx) => (
                  <TableRow key={teacher.teacher_id}>
                    <TableCell className="border">
                      {((Number(pageInfo.active_page) || 1) - 1) *
                        teachersLimitPerBoard +
                        teacher_idx +
                        1}
                    </TableCell>
                    {teacherBoardList.map((item, index) => (
                      <TableCell key={index} className="cursor-pointer border">
                        <p className="w-full h-full p-4">
                          {item.beforeText}
                          {item.process(
                            teacher[item.value as keyof typeof teacher] || "—"
                          )}
                          {item.afterText}
                        </p>
                      </TableCell>
                    ))}
                    <TableCell className="h-full cursor-pointer ">
                      <ContextMenu
                        onOpenChange={(e) =>
                          setContextMenuState((prev) => ({
                            ...prev,
                            action: { teacher_id: e ? teacher.teacher_id : "" },
                          }))
                        }
                      >
                        <ContextMenuTrigger asChild>
                          <Grip className="h-4 w-4 mx-auto" />
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          <Link href={`/t/${teacher.teacher_id}`}>
                            <ContextMenuItem>
                              <User2 className="mr-2 h-4 w-4" /> Profile
                            </ContextMenuItem>
                          </Link>
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => {
                                  e.preventDefault();
                                  handleGetTeacherInfo(teacher.teacher_id);
                                }}
                              >
                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                              {loading.teacher_info ? (
                                <div className="w-full h-full flex justify-center items-center">
                                  {<Loader2 className="h-4 w-4 animate-spin" />}
                                </div>
                              ) : (
                                <TeacherEntryForm
                                  form={form}
                                  onSubmit={(e) => console.log(e)}
                                />
                              )}
                            </DialogContent>
                          </Dialog>
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <p>
                                  Delete{" "}
                                  <HighlightWrapper>
                                    {teacher.first_name} {teacher.last_name}
                                  </HighlightWrapper>
                                </p>
                              </DialogHeader>
                              <DialogDescription>
                                <p>
                                  Are you sure you want to delete{" "}
                                  <HighlightWrapper>
                                    {teacher.first_name} {teacher.last_name}
                                  </HighlightWrapper>{" "}
                                  from database. This is an{" "}
                                  <UnderlineWrapper className="decoration-red-500">
                                    irreversible action
                                  </UnderlineWrapper>
                                  and will delete all the data related to this
                                  teacher.
                                </p>
                              </DialogDescription>
                              <DialogFooter>
                                <DialogClose>
                                  <Button variant={"secondary"}>Cancel</Button>
                                </DialogClose>
                                <Button
                                  variant={"destructive"}
                                  onClick={() =>
                                    handleDeleteTeacher(teacher.teacher_id)
                                  }
                                >
                                  {loading.delete_teacher ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : null}
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </ContextMenuContent>
                      </ContextMenu>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <PaginationBar
          activePage={Number(pageInfo.active_page) || 1}
          baseLink="/t?p=%s"
          replaceString="%s"
          totalPages={Math.ceil(teachers_count / teachersLimitPerBoard) | 1}
          minPage={1}
          pageItemLimit={5}
          className="mt-4"
        />
      </div>
    </main>
  );
}

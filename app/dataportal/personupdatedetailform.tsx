"use client";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/hooks/use-toast";
import { UserRoundPlus } from "lucide-react";
import { CreateOrUpdatePersonNode } from "../utils/neo4j";
import { RecordShape } from "neo4j-driver";
import { fetchNames, fetchData } from "../utils/neo4j";

type Props = {};
const FormSchema = z.object({
  personname: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  personsurname: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  personmodifiedname: z.string().min(2, {
    message: "modified name must be at least 2 characters.",
  }),
  persongender: z.string().regex(new RegExp(/^[MF]$/), {
    message: "Only M(male)/F(female) is allowed.",
  }),
  persondob: z.string().min(2, {
    message: "dob must be in mm/dd/yyyy.",
  }),
  personDAstatus: z.string().regex(new RegExp(/^[DA]$/), {
    message: "Only D(Dead)/A(Alive) is allowed",
  }),
  personlocation: z.string().min(2, {
    message: "Only String allowed",
  }),
  personmayka: z.string().min(2, {
    message: "Only String allowed",
  }),
  personsasuraal: z.string().min(2, {
    message: "Only String allowed",
  }),
  personmarrigestatus: z.string().regex(new RegExp(/^(MRD|UMD)$/), {
    message: "Only MRD(Married)/UMD(Unmarried) is allowed",
  }),
});

const PersonUpdateDetailForm = (props: Props) => {
  const { toast } = useToast();
  const [fromPersonList, setFromPersonList] = useState<
    RecordShape[] | undefined
  >([]);
  const [nameLoading, setNameLoading] = useState<boolean>(false);
  const [fromNameOpen, setFromNameOpen] = useState<boolean>(false);
  const [fromNameValue, setFromNameValue] = useState<string>("");
  const [fromName, setFromName] = useState<string>("");
  // const [currentFromPerson, setCurrentFromPerson] = useState<
  //   RecordShape | undefined
  // >();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      personname: "",
      personsurname: "",
      personmodifiedname: "",
      persongender: "",
      persondob: "",
      personDAstatus: "",
      personlocation: "",
      personmayka: "",
      personsasuraal: "",
      personmarrigestatus: "",
    },
  });
  const { formState, reset } = form;
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("inside onsubmit:", data);
    const query = `MERGE (p:Person {person_id: '${fromNameValue}'})
        SET
        p.person_name = '${data.personname}',
        p.person_surname = '${data.personsurname}',
        p.person_modified_name = '${data.personmodifiedname}',
        p.person_gender = '${data.persongender}',
        p.person_dob = '${data.persondob}',
        p.person_birth_place = '${data.personlocation}',
        p.person_D_A_status = '${data.personDAstatus}',
        p.person_sasuraal = '${data.personsasuraal}',
        p.person_mayka = '${data.personmayka}',
        p.person_marrige_status = '${data.personmarrigestatus}',
        p.updated_at = timestamp()`;
    try {
      await CreateOrUpdatePersonNode(query);
      toast({
        description: "Relation Updated Successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error("person update detail error:", error);
      toast({
        description: "unable to update relationship",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    // console.log("formstate: ", formState.isSubmitSuccessful);
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  useEffect(() => {
    const setData = setTimeout(async () => {
      await onFromNameSearch(fromName);
    }, 1000);
    return () => clearTimeout(setData);
  }, [fromName]);

  const onFromNameSearch = async (val: string) => {
    const str = val.toLowerCase();
    const query = `MATCH (p:Person) WHERE lower(p.person_name) STARTS WITH '${str}' OR lower(p.person_name) ENDS WITH '${str}' OR lower(p.person_name) CONTAINS '${str}' RETURN p.person_name AS name, p.person_surname as lname, p.person_id AS id, p.person_gender AS gender`;
    // const query = `MATCH (p:Person) WHERE p.person_id STARTS WITH '${val}' return p.person_name AS name, p.person_id AS id`;
    try {
      setNameLoading(true);
      if (str !== "" && str.length > 2) {
        const result = await fetchNames(query);
        // console.log("names list: ", result, typeof result);
        setFromPersonList(result);
      }
    } catch (error) {
      console.error("error loading name: ", error);
    } finally {
      setNameLoading(false);
    }
  };

  const onClickFetch = async () => {
    const query = `MATCH (p:Person {person_id: "${fromNameValue}"}) return p.person_name AS personname, p.person_surname AS personsurname, p.person_modified_name as personmodifiedname, p.person_gender as persongender, p.person_dob as persondob, p.person_D_A_status AS personDAstatus, p.person_birth_place AS personlocation, p.person_mayka AS personmayka, p.person_sasuraal AS personsasuraal, p.person_marrige_status as personmarrigestatus;`;
    try {
      const data = await fetchData(query);
      console.log("user data: ", data);
      if (data != undefined) {
        console.log(
          "user dob: ",
          data[0].persondob
            ?.toString()
            .slice(0, 10)
            .split("-")
            .reverse()
            .join("/")
        );
        reset({
          personname: data[0].personname,
          personsurname: data[0].personsurname,
          personmodifiedname: data[0].personmodifiedname,
          persongender: data[0].persongender,
          persondob: data[0].persondob
            .toString()
            .slice(0, 10)
            .split("-")
            .reverse()
            .join("/"),
          personDAstatus: data[0].personDAstatus,
          personlocation: data[0].personlocation,
          personmayka: data[0].personmayka,
          personsasuraal: data[0].personsasuraal,
          personmarrigestatus: data[0].personmarrigestatus,
        });
      }
    } catch (error) {
      console.error("unable to fetch user info: ", error);
      toast({
        description: "Unable to fetch User data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 p-8 border-[1px] border-zinc-400">
      <div className="flex gap-4 items-center">
        <Popover open={fromNameOpen} onOpenChange={setFromNameOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={fromNameOpen}
              className="w-[468px] justify-start text-black"
            >
              {fromNameValue
                ? (() => {
                    const res = fromPersonList?.find(
                      (person) => person.id === fromNameValue
                    );
                    return res
                      ? `${res?.name} ${res?.lname}`
                      : "Search Name...";
                  })()
                : "Search Name..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[468px]">
            <Command>
              {/* <CommandInput
                placeholder="From Person"
                // onChangeCapture={(e) => setFromName(e.currentTarget.value)}
                onValueChange={(value) => setFromName(value)}
              /> */}
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <input
                  placeholder="From Person"
                  value={fromName}
                  onChange={(e) => setFromName(e.currentTarget.value)}
                  className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-slate-400"
                />
              </div>
              <CommandList>
                <CommandEmpty>
                  {nameLoading ? "Loading..." : "No Person found."}
                </CommandEmpty>
                <CommandGroup>
                  {fromPersonList?.map((person) => (
                    <CommandItem
                      key={person.id}
                      value={person.id}
                      onSelect={(currentValue) => {
                        setFromNameValue(
                          currentValue === fromNameValue ? "" : currentValue
                        );
                        // setCurrentFromPerson(person);
                        setFromNameOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          fromNameValue === person.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {person.name + " " + person.lname}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Button
          onClick={onClickFetch}
          className="text-white bg-sky-800 rounded-lg hover:bg-sky-700 transition-colors"
        >
          Fetch
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="personname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Name" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="personsurname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Surname</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Surname" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="personmodifiedname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Modified Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Modified Name" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="persongender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Gender</FormLabel>
                <FormControl>
                  <Input placeholder="M(Male)/F(Female)" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="persondob"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Date of Birth</FormLabel>
                <FormControl>
                  <Input placeholder="ex. mm/dd/yyyy" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="personDAstatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Dead OR Alive</FormLabel>
                <FormControl>
                  <Input placeholder="D(Dead)/A(Alive)" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="personlocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Location</FormLabel>
                <FormControl>
                  <Input placeholder="ex. Balaghat" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a city, village, town etc. name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="personmayka"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Maayka</FormLabel>
                <FormControl>
                  <Input placeholder="ex. Chichgaon" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a city, village, town etc. name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="personsasuraal"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Sasuraal</FormLabel>
                <FormControl>
                  <Input placeholder="ex. Ankhiwada" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a city, village, town etc. name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="personmarrigestatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Marrige Status</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ex. MRD(Married)/UMD(Unmarried)"
                    {...field}
                  />
                </FormControl>
                <FormDescription>What is marriage status.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="text-white bg-sky-800 rounded-lg hover:bg-sky-700 transition-colors"
          >
            <UserRoundPlus className="mr-2 h-4 w-4" /> Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PersonUpdateDetailForm;

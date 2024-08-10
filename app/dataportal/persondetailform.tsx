"use client";
import { useEffect } from "react";

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
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { UserRoundPlus } from "lucide-react";

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
    message: "dob must be in dd/mm/yyyy.",
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

type Props = {};

const PersonDetailForm = (props: Props) => {
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
  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("inside onsubmit:", data);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  useEffect(() => {
    console.log("formstate: ", formState.isSubmitSuccessful);
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 p-8 border-[1px] border-zinc-400"
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
                <Input placeholder="ex. dd/mm/yyyy" {...field} />
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
  );
};

export default PersonDetailForm;

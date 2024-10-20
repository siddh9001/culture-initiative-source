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
import { useToast } from "@/components/hooks/use-toast";
import { UserRoundPlus } from "lucide-react";
import { CreateOrUpdatePersonNode } from "../utils/neo4j";

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
  const { toast } = useToast();
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
    const new_person_id = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
    const query = `MERGE (p:Person {person_id: '${new_person_id}'})
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
        p.created_at = timestamp()`;
    try {
      if (
        data.personname !== "" &&
        data.personsurname !== "" &&
        data.personmodifiedname !== "" &&
        data.persongender !== "" &&
        data.persondob !== "" &&
        data.personlocation !== "" &&
        data.personDAstatus !== "" &&
        data.personsasuraal !== "" &&
        data.personmayka !== "" &&
        data.personmarrigestatus !== ""
      ) {
        await CreateOrUpdatePersonNode(query);
        toast({
          description: "Relation Updated Successfully!",
          variant: "success",
        });
      }
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
              <FormDescription>व्यक्ति का नाम</FormDescription>
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
              <FormDescription>व्यक्ति का उपनाम</FormDescription>
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
                व्यक्ति का बदला हुआ नाम । ना होने पर NA भरें
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
              <FormDescription>व्यक्ति का लिंग। केवल M/F</FormDescription>
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
              <FormDescription>व्यक्ति की जन्मतारिख</FormDescription>
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
              <FormDescription>जीवित या मृत । केवल D/A</FormDescription>
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
              <FormDescription>व्यक्ति का वर्तमान निवासस्थान ।</FormDescription>
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
                व्यक्ति का मायका । एक से ज्यादा होने पर , देकर भरें । ना होने पर
                NA भरें
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
                व्यक्ति का ससुराल । एक से ज्यादा होने पर , देकर भरें । ना होने
                पर NA भरें
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
              <FormDescription>
                विवाहित या अविवाहित । केवल MRD/UMD भरें
              </FormDescription>
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

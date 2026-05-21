import TestPortalForm from "@/components/TestPortalForm";
import { sql } from "@/lib/db";

type TestPortalOption = {
  exam: string;
  subject: string;
  lectureTitle: string;
  subTitle: string;
};

type TestPortalSearchParams = {
  exam?: string;
  subject?: string;
  lecture_title?: string;
  sub_title?: string;
  type?: string;
};

export default async function TestPortalPage({
  searchParams,
}: {
  searchParams: Promise<TestPortalSearchParams>;
}) {
  const initialValues =
    await searchParams;

  const options = (await sql`
    SELECT DISTINCT
      exams.name AS exam,
      lectures.subject_name AS subject,
      lectures.lecture_title AS "lectureTitle",
      lectures.sub_title AS "subTitle"
    FROM lectures
    JOIN courses
      ON courses.id = lectures.course_id
    JOIN exams
      ON exams.id = courses.exam_id
    WHERE lectures.subject_name IS NOT NULL
      AND lectures.lecture_title IS NOT NULL
      AND lectures.sub_title IS NOT NULL
    ORDER BY
      exams.name ASC,
      lectures.subject_name ASC,
      lectures.lecture_title ASC,
      lectures.sub_title ASC
  `) as TestPortalOption[];

  return (
    <TestPortalForm
      options={options}
      initialValues={{
        exam: initialValues.exam || "",
        subject: initialValues.subject || "",
        lectureTitle:
          initialValues.lecture_title ||
          "",
        subTitle:
          initialValues.sub_title || "",
        type:
          initialValues.type === "pyqs"
            ? "pyqs"
            : "mcqs",
      }}
    />
  );
}

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { api } from "~/utils/api";
import MultiSelectCategory from "../components/MultiSelectCategory";
import { FaRegImages } from "react-icons/fa";
const WriteStory = () => {
  const { status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const submit = api.post.create.useMutation();
  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      // If the interest is already selected, remove it
      setSelectedInterests(
        selectedInterests.filter((item) => item !== interest),
      );
    } else {
      // If the interest is not selected, add it
      setSelectedInterests([...selectedInterests, interest]);
    }
  };
  console.log(selectedInterests);
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setDescription(e.target.value);
  };
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      submit.mutate({
        title: title,
        description: description,
        content: content,
        categories: selectedInterests,
      });
      // Clear form after successful submission
      setTitle("");
      setContent("");
      setDescription("");
    } catch (error) {
      console.error("Error submitting post:", error);
    } finally {
      setIsSubmitting(false);
      await router.push("/");
    }
  };
  if (status !== "authenticated") return;
  return (
    <div className="relative">
      <div className="flex items-center justify-center">
        <div className="w-full rounded   sm:max-w-3xl md:max-w-2xl lg:max-w-5xl ">
          <div className="mb-[15px] flex w-full space-x-5 items-center">
            <MultiSelectCategory
              handleInterestToggle={handleInterestToggle}
              selectedInterests={selectedInterests}
            />
             <div className="mt-[60px] flex items-center space-x-1">
              <FaRegImages className=" h-[20px] w-[20px]" />
              <p className="cursor-pointer text-center text-sm font-semibold text-[#334155]">
                {" "}
                Add image
              </p>
            </div>
          </div>
          <input
            type="text"
            id="title"
            className="mt-1 h-auto min-h-[33px] w-full rounded  py-4    text-4xl  font-extrabold focus:outline-none "
            value={title}
            placeholder="Post Title ..."
            onChange={handleTitleChange}
          />

          <textarea
            id="description"
            className="mt-[0.75rem] h-auto min-h-[50px] w-full resize-none rounded py-2 text-2xl font-medium focus:outline-none"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Post Description ..."
          />

          <textarea
            id="content"
            className="mt-1 h-auto w-full resize-none rounded py-2 text-xl font-normal focus:outline-none"
            value={content}
            placeholder="Create your content ..."
            onChange={handleContentChange}
          />
        </div>
      </div>
      <button
        className={`absolute right-8 top-8 mt-4 rounded-full bg-blue-700 px-4 py-2 font-semibold text-white ${
          isSubmitting ? "cursor-not-allowed opacity-50" : "hover:bg-blue-600"
        }`}
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Publishing..." : "Publish"}
      </button>
    </div>
  );
};

export default WriteStory;

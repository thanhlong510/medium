import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { api } from "~/utils/api";
import MultiSelectCategory from "../components/MultiSelectCategory";
import { FaRegImages } from "react-icons/fa";
import TipTap from "../components/TipTap";
import UploadFileCoppy from "../components/UploadCoverPhoto";
import dayjs from "dayjs";
const WriteStory = () => {
 
  const {data:session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const submit = api.post.create.useMutation();
  console.log(coverImage)
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
        coverImageName:coverImage
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
<div className="relative max-w-[400px] sm:max-w-xl ml-6 md:max-w-3xl md:flex sm:mx-auto lg:max-w-6xl  lg:justify-center lg:mx-auto">
  <div className="flex items-center justify-center">
    <div className="w-full rounded sm:max-w-3xl md:max-w-2xl lg:max-w-5xl ">
      <div className="mb-[15px] flex w-full space-x-5 items-center">
        <MultiSelectCategory
          handleInterestToggle={handleInterestToggle}
          selectedInterests={selectedInterests}
        />
        <UploadFileCoppy setCoverImage={setCoverImage} initfileName={`${session.user.id}`}/>
      </div>
      <input
        type="text"
        id="title"
        className="mt-1 h-auto min-h-[33px]  w-full rounded py-4 text-4xl font-extrabold focus:outline-none "
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

      {/* <textarea
        id="content"
        className="mt-1 h-auto min-h-[100px] w-full resize-none rounded py-2 text-xl font-normal focus:outline-none"
        value={content}
        placeholder="Create your content ..."
        onChange={handleContentChange}
      />
   */}
      <TipTap content={content} setContent={setContent}/>
      
    </div>
  </div>
  <button
    className={`absolute right-0 sm:right-3 md:right-8 top-8 mt-4 rounded-full bg-blue-700 px-4 py-2 font-semibold text-white ${
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

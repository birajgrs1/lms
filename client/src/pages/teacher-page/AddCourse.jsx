import { useState, useRef, useEffect, useContext } from "react";
import { assets } from "../../assets/assets";
import uniqid from "uniqid";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import AppContext from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddCourse = () => {
  const { backendUrl, getToken } = useContext(AppContext);

  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: 0,
    lectureUrl: "",
    isPreviewFree: false,
  });

  // Initialize Quill editor
  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        },
        placeholder: "Enter course description...",
      });
    }
  }, []);

  // Add a new chapter
  const addChapter = () => {
    const newChapter = {
      id: uniqid(),
      chapterId: uniqid(), // Added chapterId
      chapterOrder: chapters.length, // Added chapterOrder
      chapterTitle: `Chapter ${chapters.length + 1}`,
      collapsed: false,
      chapterContent: [],
    };
    setChapters([...chapters, newChapter]);
  };

  // Toggle chapter collapse/expand
  const toggleChapter = (chapterId) => {
    setChapters(
      chapters.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, collapsed: !chapter.collapsed }
          : chapter
      )
    );
  };

  // Delete a chapter
  const deleteChapter = (chapterId) => {
    setChapters(chapters.filter((chapter) => chapter.id !== chapterId));
  };

  // Open popup to add lecture to a specific chapter
  const openAddLecturePopup = (chapterId) => {
    setCurrentChapterId(chapterId);
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: 0,
      lectureUrl: "",
      isPreviewFree: false,
    });
    setShowPopup(true);
  };

  // Add a new lecture to a chapter
  const addLecture = () => {
    if (!lectureDetails.lectureTitle || !lectureDetails.lectureUrl) {
      alert("Please fill in all required fields");
      return;
    }

    setChapters(
      chapters.map((chapter) => {
        if (chapter.id === currentChapterId) {
          return {
            ...chapter,
            chapterContent: [
              ...chapter.chapterContent,
              {
                ...lectureDetails,
                id: uniqid(),
                lectureId: uniqid(), // Added lectureId
                lectureOrder: chapter.chapterContent.length, // Added lectureOrder
              },
            ],
          };
        }
        return chapter;
      })
    );

    setShowPopup(false);
  };

  // Delete a lecture from a chapter
  const deleteLecture = (chapterId, lectureId) => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.id === chapterId) {
          return {
            ...chapter,
            chapterContent: chapter.chapterContent.filter(
              (lecture) => lecture.id !== lectureId
            ),
          };
        }
        return chapter;
      })
    );
  };

  // Update chapter title
  const updateChapterTitle = (chapterId, newTitle) => {
    setChapters(
      chapters.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, chapterTitle: newTitle }
          : chapter
      )
    );
  };

  // Handle form submission with API integration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!image) {
      toast.error("Thumbnail Not Selected");
      setLoading(false);
      return;
    }

    try {
      // Get content from Quill editor
      const courseDescription = quillRef.current.root.innerHTML;

      // Prepare course data with all required fields
      const courseData = {
        courseTitle,
        courseDescription,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        isPublished: false, // Added isPublished field
        courseContent: chapters.map((chapter, chapterIndex) => ({ // FIXED: CourseContent -> courseContent
          chapterId: chapter.chapterId || chapter.id,
          chapterOrder:
            chapter.chapterOrder !== undefined
              ? chapter.chapterOrder
              : chapterIndex,
          chapterTitle: chapter.chapterTitle,
          chapterContent: chapter.chapterContent.map(
            (lecture, lectureIndex) => ({
              lectureId: lecture.lectureId || lecture.id,
              lectureOrder:
                lecture.lectureOrder !== undefined
                  ? lecture.lectureOrder
                  : lectureIndex,
              lectureTitle: lecture.lectureTitle,
              lectureDuration: Number(lecture.lectureDuration), // Added Number conversion
              lectureUrl: lecture.lectureUrl,
              isPreviewFree: Boolean(lecture.isPreviewFree), // Added Boolean conversion
            })
          ),
        })),
      };

      const formData = new FormData();
      formData.append("courseData", JSON.stringify(courseData));
      formData.append("courseThumbnail", image);

      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/educator/add-course`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        // Reset form
        setCourseTitle("");
        setCoursePrice(0);
        setDiscount(0);
        setImage(null);
        setChapters([]);
        quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error submitting course:", error);
      // More detailed error logging
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        toast.error(error.response.data.message || "Failed to submit course");
      } else if (error.request) {
        console.error("Request:", error.request);
        toast.error("No response received from server");
      } else {
        console.error("Error message:", error.message);
        toast.error(error.message || "Failed to submit course");
      }
    } finally {
      setLoading(false);
    }
  };

  /*
  // OLD CODE: handleSubmit without API integration
  const handleSubmit = (e) => {
    // e.preventDefault();
    // Get content from Quill editor
    // const courseDescription = quillRef.current.root.innerHTML;

    try{
      e.preventDefault();
      if(!image){
        toast.error("Thumbnail Not Selected");
      }
      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        courseThumbnail: image,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      }
      const formData = new FormData();
      formData.append("courseData", JSON.stringify(courseData));
      formData.append("courseThumbnail", image);

      const token = await getToken();
      const {data} = await axios.post(`${backendUrl}/api/educator/add-course`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if(data.success){
        toast.success(data.message);
        setCourseTitle("");
        setCourseDescription("");
        setCourseThumbnail(null);
        setCoursePrice(0);
        setDiscount(0);
        setChapters([]);
        quillRef.current.root.innerHTML = "";
      }
      else{
        toast.error(data.message);
      }
         
  }
    
    catch(error){
      toast.error(error.response?.data?.message || "Failed to submit course");
    }
  };
  */

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Add New Course
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Title */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">Course Title</label>
            <input
              type="text"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="Enter course title"
              className="border border-gray-300 outline-none rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Course Description with Quill Editor */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">
              Course Description
            </label>
            <div ref={editorRef} className="h-64 mb-8"></div>
          </div>

          {/* Course Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Course Price */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-700 font-medium">
                Course Price ($)
              </label>
              <input
                type="number"
                value={coursePrice}
                onChange={(e) => setCoursePrice(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="border border-gray-300 outline-none rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Discount */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-700 font-medium">Discount (%)</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="0"
                min="0"
                max="100"
                className="border border-gray-300 outline-none rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Course Thumbnail */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-700 font-medium">
                Course Thumbnail
              </label>
              <div className="flex items-center gap-3">
                <label htmlFor="thumbnailImage" className="cursor-pointer">
                  <div className="border border-dashed border-gray-300 rounded-lg p-3 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                    <img
                      src={assets.file_upload_icon}
                      alt="file upload icon"
                      className="w-8 h-8 mb-1"
                    />
                    <span className="text-sm text-gray-500">Upload Image</span>
                  </div>
                </label>
                <input
                  type="file"
                  id="thumbnailImage"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Store the file object instead of data URL for FormData
                      setImage(file);
                    }
                  }}
                  accept="image/*"
                  hidden
                />
                {image && (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Course thumbnail"
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chapters and Lectures */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Course Content
            </h2>

            {chapters.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 mb-4">No chapters added yet</p>
                <button
                  type="button"
                  onClick={addChapter}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Add Your First Chapter
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="bg-white border rounded-lg shadow-sm overflow-hidden"
                  >
                    {/* Chapter Header */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleChapter(chapter.id)}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <img
                            src={assets.dropdown_icon}
                            alt="chapter dropdown icon"
                            width={16}
                            className={`transition-transform ${
                              chapter.collapsed ? "-rotate-90" : ""
                            }`}
                          />
                        </button>
                        <input
                          type="text"
                          value={chapter.chapterTitle}
                          onChange={(e) =>
                            updateChapterTitle(chapter.id, e.target.value)
                          }
                          className="font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-1"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500 text-sm">
                          {chapter.chapterContent.length} Lecture
                          {chapter.chapterContent.length !== 1 ? "s" : ""}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteChapter(chapter.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <img
                            src={assets.cross_icon}
                            alt="delete chapter"
                            width={16}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Chapter Content */}
                    {!chapter.collapsed && (
                      <div className="p-4">
                        {chapter.chapterContent.length === 0 ? (
                          <p className="text-gray-500 text-sm italic mb-4">
                            No lectures in this chapter yet
                          </p>
                        ) : (
                          <div className="space-y-3 mb-4">
                            {chapter.chapterContent.map((lecture) => (
                              <div
                                key={lecture.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-800">
                                    {lecture.lectureTitle}
                                  </h4>
                                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                    <span>{lecture.lectureDuration} mins</span>
                                    <span>•</span>
                                    <a
                                      href={lecture.lectureUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      View Content
                                    </a>
                                    <span>•</span>
                                    <span
                                      className={
                                        lecture.isPreviewFree
                                          ? "text-green-600"
                                          : "text-gray-600"
                                      }
                                    >
                                      {lecture.isPreviewFree
                                        ? "Free Preview"
                                        : "Paid"}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteLecture(chapter.id, lecture.id)
                                  }
                                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                                >
                                  <img
                                    src={assets.cross_icon}
                                    alt="delete lecture"
                                    width={16}
                                  />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => openAddLecturePopup(chapter.id)}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100"
                        >
                          <span>+</span>
                          <span>Add Lecture</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addChapter}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mt-4 px-4 py-2 rounded-lg border border-dashed border-blue-300 hover:bg-blue-50"
                >
                  <span>+</span>
                  <span>Add Chapter</span>
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className={`w-full md:w-auto px-6 py-3 font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg ${
                loading
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? "Adding Course..." : "ADD COURSE"}
            </button>
          </div>
        </form>

        {/* Add Lecture Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Add New Lecture
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Lecture Title
                    </label>
                    <input
                      type="text"
                      value={lectureDetails.lectureTitle}
                      onChange={(e) =>
                        setLectureDetails({
                          ...lectureDetails,
                          lectureTitle: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 outline-none rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={lectureDetails.lectureDuration}
                      onChange={(e) =>
                        setLectureDetails({
                          ...lectureDetails,
                          lectureDuration: parseInt(e.target.value) || 0,
                        })
                      }
                      min="0"
                      className="w-full border border-gray-300 outline-none rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">
                      Lecture URL
                    </label>
                    <input
                      type="url"
                      value={lectureDetails.lectureUrl}
                      onChange={(e) =>
                        setLectureDetails({
                          ...lectureDetails,
                          lectureUrl: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 outline-none rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="previewFree"
                      checked={lectureDetails.isPreviewFree}
                      onChange={(e) =>
                        setLectureDetails({
                          ...lectureDetails,
                          isPreviewFree: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="previewFree" className="text-gray-700">
                      Available for free preview
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={addLecture}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                    ADD LECTURE
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPopup(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
                    >
                    CANCEL
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                >
                <img src={assets.cross_icon} alt="close popup" width={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCourse;
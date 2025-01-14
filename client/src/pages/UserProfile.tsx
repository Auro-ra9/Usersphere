import { useEffect, useState } from "react";
import { UserNavbar } from "../components/UserNavbar";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// import { storage } from "../firebase/firebaseConfig";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { supabase } from "../supabase/supabaseConfig";

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    id: "",
    image: "",
  });
  const theme = useSelector((state: RootState) => state.theme.mode);

  const navigate = useNavigate();

  useEffect(() => {
    getProfileDetails();
  }, []);

  const getProfileDetails = async () => {
    try {
      let response = await axiosInstance.post("/api/get-profile");

      if (response.data) {
        toast.success(response.data.message);
        setUserDetails({
          email: response.data.user.email,
          name: response.data.user.name,
          id: response.data.user.id,
          image: response.data.user.image || "",
        });
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
      navigate("/home");
    } finally {
      setLoading(false);
    }
  };
  //supabase config
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const target = e.target as HTMLInputElement;

      if (target.files && target.files.length > 0) {
        const selectedFile = target.files[0];
        const pathName = `${userDetails.email}/${selectedFile.name}`;

        //upload the file to supabase storage
        const { data, error } = await supabase.storage
          .from("images_userphere")
          .upload(pathName, selectedFile);

        if (error) {
          toast.error(`error uploading file: ${error.message}`);
          console.log(`error uploading file: ${error.message}`);
          return;
        }
        console.log("Upload response data:", data);

        // Get the public URL of the uploaded file
        const { data: url } = supabase.storage
          .from("images_userphere")
          .getPublicUrl(pathName);
        const publicURL = url?.publicUrl; // Access the publicUrl from the data

        if (!publicURL) {
          toast.error("Error getting public URL");
          console.log("Error getting public URL");

          return; // Exit the function if publicURL is not available
        }

        let response = await axiosInstance.post("/api/upload-image", {
          image: publicURL,
        });

        if (response.data) {
          setUserDetails({ ...userDetails, image: response.data.image });
          toast.success(response.data.message);
        }
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error("An error occurred: " + error.message);
    }
  };
  //firebase config
  // const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   try {
  //     const target = e.target as HTMLInputElement;

  //     if (target.files && target.files.length > 0) {
  //       const selectedFile = target.files[0];
  //       const pathName = `${userDetails.email}`;
  //       const storageRef = ref(storage, pathName);

  //       // Start the file upload
  //       const snapShot = await uploadBytes(storageRef, selectedFile);

  //       const downloadURL = await getDownloadURL(snapShot.ref);

  //       let response = await axiosInstance.post("/api/upload-image", {
  //         image: downloadURL,
  //       });

  //       if (response.data) {
  //         setUserDetails({ ...userDetails, image: response.data.image });
  //         toast.success(response.data.message);
  //       }
  //     }
  //   } catch (error: any) {
  //     console.error("Error uploading image:", error);
  //     toast.error("An error occurred: " + error.message);
  //   }
  // };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <>
      <UserNavbar />
      <div
        className={`flex-grow flex  items-center justify-center ${
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-gray-800 border-gray-700"
        }`}
      >
        <div className="w-full max-w-sm bg- border border-gray-200 rounded-lg shadow">
          <div className="flex flex-col items-center pb-10">
            <img
              className="w-24 h-24 mb-3 rounded-full shadow-lg"
              src={userDetails.image}
              alt={userDetails.name}
            />
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
              {userDetails.name}
            </h5>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {userDetails.email}
            </span>
            <div className="flex mt-4 md:mt-6">
              <input
                type="file"
                hidden
                id="image-upload"
                onChange={(e) => handleImageUpload(e)}
              />
              <label
                htmlFor="image-upload"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Upload Profile Picture
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;

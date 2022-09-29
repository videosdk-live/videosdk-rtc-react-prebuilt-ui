import { appThemes } from "../../../MeetingAppContextDef";
import { SingleRow } from "./VirtualBackgroundContainer";

const DesktopBackgroundSection = ({ videoProcessor, appTheme }) => {
  const firstRowArr = [
    {
      imageUrl:
        appTheme === appThemes.DARK
          ? `${process.env.PUBLIC_URL}/VirtualBackground/no-filter-dark.png`
          : appTheme === appThemes.LIGHT
          ? `${process.env.PUBLIC_URL}/VirtualBackground/no-filter-light.png`
          : `${process.env.PUBLIC_URL}/VirtualBackground/No-filter.png`,
      displayImageUrl: "",
    },
    {
      imageUrl:
        appTheme === appThemes.DARK
          ? `${process.env.PUBLIC_URL}/VirtualBackground/blur-dark.png`
          : appTheme === appThemes.LIGHT
          ? `${process.env.PUBLIC_URL}/VirtualBackground/blur-light.png`
          : `${process.env.PUBLIC_URL}/VirtualBackground/Blur.png`,
      displayImageUrl: "",
    },
    {
      imageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-1.png`,
      displayImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-1.jpg`,
    },
  ];

  const secondRowArr = [
    {
      imageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-2.png`,
      displayImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-2.jpg`,
    },
    {
      imageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-3.png`,
      displayImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-3.jpg`,
    },
    ,
    {
      imageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-4.png`,
      displayImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-4.jpg`,
    },
  ];

  const thirdRowArr = [
    {
      imageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-5.png`,
      displayImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-5.jpg`,
    },
    {
      imageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-6.png`,
      displayImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-6.jpg`,
    },
    {
      imageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-7.png`,
      displayImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-7.jpg`,
    },
  ];

  const fourthRowArr = [
    {
      imageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-8.png`,
      displayImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-8.jpg`,
    },
    {
      imageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-9.png`,
      displayImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-9.jpg`,
    },
    {
      imageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-10.png`,
      displayImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-10.jpg`,
    },
  ];

  const fifthRowArr = [
    {
      imageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-11.png`,
      displayImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-11.jpg`,
    },
    {
      imageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-12.png`,
      displayImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-12.jpg`,
    },
    {
      imageUrl: `${process.env.PUBLIC_URL}/VirtualBackground/image-13.png`,
      displayImageUrl: `${process.env.PUBLIC_URL}/bgImages/image-13.jpg`,
    },
  ];
  return (
    <>
      {/* 1st row */}
      <SingleRow
        arr={firstRowArr}
        blur={true}
        videoProcessor={videoProcessor}
        topSpacing={false}
      />
      {/* 2nd row */}
      <SingleRow
        arr={secondRowArr}
        topSpacing={true}
        videoProcessor={videoProcessor}
      />
      {/* 3rd row */}
      <SingleRow
        arr={thirdRowArr}
        topSpacing={true}
        videoProcessor={videoProcessor}
      />
      {/* 4th row */}
      <SingleRow
        arr={fourthRowArr}
        topSpacing={true}
        videoProcessor={videoProcessor}
      />
      {/* 5th row */}
      <SingleRow
        arr={fifthRowArr}
        topSpacing={true}
        videoProcessor={videoProcessor}
      />
    </>
  );
};

export default DesktopBackgroundSection;

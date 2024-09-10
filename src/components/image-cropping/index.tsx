"use client";
import { useMemo, useRef, useState } from "react";
import Cropper, { type Size } from "react-easy-crop";
import { getCroppedImg } from "@/utils/image-cropping";
import {
  FlexColCenter,
  FlexColStart,
  FlexColStartCenter,
  FlexRowCenter,
  FlexRowCenterBtw,
  FlexRowEnd,
  FlexRowEndCenter,
  FlexRowStartBtw,
  FlexRowStartCenter,
} from "../Flex";
import ReactModal from "react-modal";
import { Slider } from "../ui/slider";
import Button from "../ui/button";
import { CloudUpload, Crop, Trash, X } from "../icons";

interface ImageCropperProps {
  image: string;
  _getImageData?: (
    original: null | undefined | string,
    cropped: null | undefined | string
  ) => void;
  dimensions?: { width: number; height: number };
  getImageMetadata?: (metadata: {
    zoom: number;
    rotation: number;
    crop: { x: number; y: number };
  }) => void;
  zoom?: number;
  closeCropper?: () => void;
  visible?: boolean;
}

const ORIENTATION_TO_ANGLE = {
  "3": 180,
  "6": 90,
  "8": -90,
};

const defaultImageDimensions = {
  height: 328,
  width: 500,
};

const heightWidthToAspectRatio = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  return width / height;
};

interface CroppedArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function ImageCropper({
  image,
  _getImageData,
  dimensions,
  zoom,
  closeCropper,
  visible,
  getImageMetadata,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [_zoom, setZoom] = useState<number>(zoom ?? 1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedArea | null>(null);
  const [_croppedImage, setCroppedImage] = useState(null);
  const [cropperSize, setCropperSize] = useState<Size | undefined>(undefined);

  const onCropComplete = (
    croppedArea: CroppedArea,
    croppedAreaPixels: CroppedArea
  ) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const aspectRatio = useMemo(() => {
    if (dimensions) {
      return heightWidthToAspectRatio({
        width: dimensions?.width ?? defaultImageDimensions.width,
        height: dimensions?.height ?? defaultImageDimensions.height,
      });
    } else {
      return 344 / 328;
    }
  }, [cropperSize, dimensions]);

  const getCroppedImageData = async () => {
    try {
      const croppedImage = await getCroppedImg(
        image,
        croppedAreaPixels!,
        rotation
      );

      _getImageData?.(image, croppedImage?.base64);
      closeCropper?.();
      getImageMetadata?.({
        zoom: _zoom,
        rotation,
        crop: crop,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ReactModal
      className={"border-none outline-none w-full h-full flex-center px-6"}
      isOpen={visible ?? false}
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
    >
      <FlexColCenter className="w-full md:max-w-[600px] h-auto mx-auto bg-white-100 gap-0 overflow-hidden rounded-md border-[.5px] border-white-400/30 shadow-md">
        {/* header */}
        <FlexRowCenterBtw className="w-full min-h-[60px] relative px-5">
          <h1 className="text-md text-dark-100 font-medium font-archivo">
            Crop Image
          </h1>

          <button className=" enableBounceEffect" onClick={closeCropper}>
            <X size={20} className="stroke-dark-100" />
          </button>
        </FlexRowCenterBtw>
        {/* image container */}
        <FlexColStartCenter className="w-full h-[400px] relative rounded-lg">
          <Cropper
            image={image}
            crop={crop}
            rotation={rotation}
            zoom={_zoom}
            zoomSpeed={0.1}
            onCropChange={setCrop}
            aspect={aspectRatio}
            onRotationChange={setRotation}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </FlexColStartCenter>
        <FlexColCenter className="w-full h-full gap-0">
          <FlexRowStartCenter className="w-full h-auto bg-white-300 px-4 py-3">
            <div className="text-sm font-archivo font-medium text-dark-100 flex items-center justify-center gap-1">
              <span>Zoom</span>{" "}
            </div>
            <Slider
              className="w-full"
              defaultValue={[_zoom]}
              value={[_zoom]}
              min={1}
              max={3}
              step={0.1}
              thumbClassName="cursor-grabbing"
              trackClassName="bg-dark-100"
              rangeClassName="bg-blue-100"
              onValueChange={(value) => {
                setZoom(value[0]);
              }}
            />

            <Button
              intent={"dark"}
              className="bg-dark-100 h-[40px] enableBounceEffect"
              onClick={getCroppedImageData}
              type="button"
            >
              <span className="text-sm font-archivo font-normal text-white-100">
                Save
              </span>
            </Button>
          </FlexRowStartCenter>
        </FlexColCenter>
      </FlexColCenter>
    </ReactModal>
  );
}

interface ImageCropperPlaceholderProps {
  label?: string;
  image?: string | null;
  openCropper: () => void;
  clearImage: () => void;
  name?: string;
}

export function ImageCropperPlaceholder({
  label,
  image,
  openCropper,
  clearImage,
  name,
}: ImageCropperPlaceholderProps) {
  return (
    <FlexColStart className="w-full h-auto rounded-lg">
      <label className="text-[14px] font-medium font-archivo text-dark-100/60">
        {label}
      </label>
      <FlexRowStartCenter className="w-full h-auto rounded-lg border-[1px] border-white-400/30 bg-white-100 px-4 py-3">
        <FlexRowCenter className="w-auto h-auto">
          <div
            className="w-[60px] h-[60px] bg-white-300 rounded-md"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <FlexColStart className="w-auto h-auto text-nowrap whitespace-nowrap">
            <span className="text-sm font-archivo font-normal text-dark-100">
              {name && name.length > 20
                ? `${name.slice(0, 20)}...${name.slice(name.lastIndexOf("."))}`
                : name}
            </span>
          </FlexColStart>
        </FlexRowCenter>

        <FlexRowEndCenter className="w-full h-full pr-2 gap-5">
          <button className="enableBounceEffect" onClick={openCropper}>
            <Crop size={20} strokeWidth={2.5} className="stroke-blue-200" />
          </button>
          <button className="enableBounceEffect" onClick={clearImage}>
            <Trash size={20} strokeWidth={2.5} className="stroke-red-305" />
          </button>
        </FlexRowEndCenter>
      </FlexRowStartCenter>
    </FlexColStart>
  );
}

interface ImageUploader {
  getImage: (image: string) => void;
  getImageName: (name: string) => void;
}

export function ImageUploader({ getImage, getImageName }: ImageUploader) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const image = reader.result as string;
        getImage(image);
        getImageName(file.name);
      };
    }
  };

  return (
    <button
      className="w-full h-auto border-none outline-none"
      onClick={() => fileRef.current?.click()}
    >
      <FlexColCenter className="w-full h-[120px] border-[2px] border-white-400/30 border-dashed gap-1 rounded-lg py-3">
        <CloudUpload size={20} className="stroke-dark-100" />
        <p className="text-[13px] font-archivo font-semibold text-dark-100 mt-1">
          Upload an image
        </p>
        <p className="text-xs font-archivo font-normal text-white-400">
          Click to upload
        </p>
      </FlexColCenter>

      <input
        ref={fileRef}
        accept="image/*"
        type="file"
        hidden
        onChange={handleImageUpload}
      />
    </button>
  );
}

const zoomPercent = (value: number) => {
  return `${Math.round(value * 100)}%`;
};

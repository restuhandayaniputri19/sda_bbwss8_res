import * as React from "react";

interface PhotoCardProps {
  src: string;
  onImageClick?: (src: string) => void;
  description: string;
  date: string;
  category?: string; // Prop kategori bersifat opsional
}

const PhotoCard: React.FC<PhotoCardProps> = ({
  src,
  onImageClick,
  description,
  date,
  category,
}) => {
  return (
    <div className="flex justify-center flex-col bg-white rounded-md cursor-pointer shadow-md">
      <img
        src={src}
        className="w-full h-auto rounded-t-md cursor-pointer"
        alt={`Photo ${src}`}
        loading="lazy"
        onClick={() => onImageClick && onImageClick(src)}
      />
      <div className="p-3 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-gray-500 text-sm">{date}</span>
            {category && (
              <span className="bg-mango/10 text-mango text-xs font-semibold px-2 py-0.5 rounded capitalize">
                {category}
              </span>
            )}
          </div>
          <label className="block mt-1 cursor-pointer">{description}</label>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
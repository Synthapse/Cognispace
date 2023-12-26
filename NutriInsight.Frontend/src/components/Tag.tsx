interface ITag {
    text: string;
    isActive?: boolean;
    onClick?: () => void;
  }

export const Tag = ({ text, isActive = false, onClick }: ITag) => {
    return (
      <div onClick={onClick} className={`tag ${isActive ? "tag-active" : ""}`}>
        <p>{text}</p>
      </div>
    )
  }
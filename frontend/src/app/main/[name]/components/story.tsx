export const StoryComponent = () => {
  return(
    <div className="story-contain">
      {Array.from({ length: 5 }).map((_, i) => (
        <div className="story-icon" key={i}></div>
      ))}
  </div>
  )
}
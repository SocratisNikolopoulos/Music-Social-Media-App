function Avatar({
    image,
    customClass = "w-14 h-14",
}: {
    image: string;
    customClass?: string;
}) {
    return (
        <img
            src={image}
            className={`${customClass} rounded-full border-2 border-orange-300 object-cover`}
        ></img>
    );
}

export default Avatar;

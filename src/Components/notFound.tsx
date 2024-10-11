import image from '../Assets/Images/not-found.webp'

export const NotFound = () => {
    return (
        <div className="flex justify-center items-center w-full bg-gray-50">
            <img
                src={image}
                alt='Not Found'
            />
        </div>
    )
}
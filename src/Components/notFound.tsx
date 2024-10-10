import image from '../Assets/Images/not-found.jpg'

export const NotFound = () => {
    return (
        <div className="flex justify-center items-center w-full bg-white">
            <img
                src={image}
                alt='Not Found'
            />
        </div>
    )
}
import image from '../Assets/Images/not-found.png'

export const NotFound = () => {
    return (
        <div className="flex justify-center items-center w-full bg-gray-50">
            <img
                src={image}
                alt='Not Found'
                className='h-48 object-cover'
            />
        </div>
    )
}
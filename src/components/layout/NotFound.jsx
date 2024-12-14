import img from '../../assests/notFound.jpg'


function NotFoundPage() {
    return (
        <div className="bg-white h-screen z-50 absolute top-0 left-0 w-full 
        text-black flex flex-col items-center justify-center">
            <img
                src={img}
                alt='not_found'
                className='w-[700px] h-[700px] object-cover aspect-square rounded-full'
            />
            <a href="http://www.freepik.com" className='text-white'>Designed by gstudioimagen / Freepik</a>
        </div>
    )
}

export default NotFoundPage
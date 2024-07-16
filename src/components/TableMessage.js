// export const CustomNoDataComponent = ({data}) => (
//     <div className="text-center p-4">
//       <h2 className="text-gray-500">{data}<>
//     </div>
//   );

const CustomNoDataComponent=({data})=>{
    return (
        <>
            <div className="text-center p-4">
                <h1 className="text-gray-500">{data}</h1>
            </div>

        </>
    )
}
export default CustomNoDataComponent;
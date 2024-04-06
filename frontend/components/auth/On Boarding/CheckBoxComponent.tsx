import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"

type Data = {
    text: string,
    image: string,
    description: string,
    setselectedRoles: Function,
    selectedRoles: Array<string>,
    role: string
}
const CheckBoxComponent = ({ text, image, description, setselectedRoles, selectedRoles, role }: Data): React.JSX.Element => {
    const [isChecked, setisChecked] = useState<boolean>(false);

    return <div
        onClick={() => {
            setisChecked(!isChecked)
            !isChecked ? setselectedRoles([...selectedRoles, role]) :
                setselectedRoles(selectedRoles.filter((e: string) => e !== role))
        }}
        className={`${isChecked && 'bg-muted border-indigo-300 max-md:mt-[100px]'}  w-[270px] h-[300px] border-solid border-2 rounded-xl p-3 cursor-pointer hover:bg-muted relative `} >

        <span className={`flex flex-col text-center items-center `}>
            <Image
                src={image}
                alt=''
                className={`${isChecked && '-translate-y-28 absolute'} h-[170px] transition-all rounded-lg object-contain bg-blend-multiply`} />
            <p className={`${isChecked && 'pt-20'} font-semibold text-lg`} >{text}</p>

            <p className={`${!isChecked && 'hidden'} transition-all text-sm my-1 text-muted-foreground`}>{description}</p>

            <Checkbox checked={isChecked} onCheckedChange={(e: boolean) => { setisChecked(e) }} className="my-5" />
        </span>

    </div>
}

export default CheckBoxComponent
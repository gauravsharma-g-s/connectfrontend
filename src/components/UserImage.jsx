const { Box } = require("@mui/material");

const UserImage = ({image,size="60px"})=>{
    const cloudImage=`https://res.cloudinary.com/ddrbtlpxj/${image}`
    return (
        <Box width={size} height={size}>
            <img
              style={{objectFit:"cover",borderRadius:"50%"}}
              width={size}
              height={size}
              alt="user"
              src={cloudImage}
              />
        </Box>
    )
}

export default UserImage;
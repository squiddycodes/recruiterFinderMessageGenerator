import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import Chip from '@mui/joy/Chip';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import CardActions from '@mui/joy/CardActions';
import Typography from '@mui/joy/Typography';
import SvgIcon from '@mui/joy/SvgIcon';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoIcon from '@mui/icons-material/Info';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';





const RecruiterCard = ({ name, location, linkedin, about, education, currentJob, tagline, status }) => {
    return (
    <Card sx={{ width: 320, maxWidth: '100%', boxShadow: 'lg' }}>
      <CardContent sx={{ alignItems: 'center', textAlign: 'center' }}>
        <Avatar src="/static/images/avatar/1.jpg" sx={{ '--Avatar-size': '4rem' }} />
        <Chip
          size="sm"
          variant="soft"
          color="primary"
          sx={{
            mt: -1,
            mb: 1,
            border: '3px solid',
            borderColor: 'background.surface',
          }}
        >
        </Chip>
        <Typography level="title-lg">{name}</Typography>
        <Typography level="body-sm" sx={{ maxWidth: '24ch' }}>
        <p><strong> <LocationOnIcon />  Location:</strong> {location}</p>
        <p><strong><InfoIcon /> About:</strong> {about}</p>
        <p><strong> <SchoolIcon />Education:</strong> {education || 'N/A'}</p>
        <p><strong> <WorkIcon /> Job:</strong> {currentJob}</p>
        <p><strong> <LabelImportantIcon />Tagline:</strong> {tagline}</p>
        <p><strong> <EventAvailableIcon /> Status:</strong> {status}</p>
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mt: 2,
            '& > button': { borderRadius: '2rem' },
          }}
        >

         

        </Box>
      </CardContent>
      <CardOverflow sx={{ bgcolor: 'background.level1' }}>
        <CardActions buttonFlex="1">
          <ButtonGroup variant="outlined" sx={{ bgcolor: 'background.surface' }}>
            <Button>Message</Button>
            <Button><a href={`https://${linkedin}`} target="_blank" rel="noopener noreferrer">LinkedIn</a></Button>
          </ButtonGroup>
        </CardActions>
      </CardOverflow>
    </Card>
  );
}

export default RecruiterCard;

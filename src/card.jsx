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
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import SvgIcon from '@mui/joy/SvgIcon';

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
        <p><strong>
        <IconButton size="sm" variant="plain" color="neutral">
            <SvgIcon>
              <svg
                xmlns="src\assets\download.png"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5Z"
                />
              </svg>
            </SvgIcon>
          </IconButton>
            Location:</strong> {location}</p>
        <p><strong>About:</strong> {about}</p>
        <p><strong>Education:</strong> {education || 'N/A'}</p>
        <p><strong>Current Job:</strong> {currentJob}</p>
        <p><strong>Tagline:</strong> {tagline}</p>
        <p><strong>Status:</strong> {status}</p>
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

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import List from '@ckeditor/ckeditor5-list/src/list';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';


import BpHighlight from './bphighlight/bphighlight';

ClassicEditor.create(
    document.querySelector( '#editor' ), {
        plugins: [
            Essentials, Paragraph, Heading, List, Bold, Italic, BpHighlight
        ],
        // Add the Timestamp button to the config.toolbar array.
        toolbar: [
            'heading', 'bold', 'italic', 'numberedList', 'bulletedList', 'bphighlight'
        ]
    } )
    .then( editor => {
        CKEditorInspector.attach( editor );
        console.log( 'Editor was initialized', editor );
    } )
    .catch( error => {
        console.error( error.stack );
    } );


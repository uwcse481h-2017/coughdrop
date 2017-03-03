import os
import textacy

def setup_corpus():
  top_dir = os.path.abspath(os.curdir)
  wiki_path = top_dir + '/data/enwiki-latest-pages-articles.xml.bz2'
  print wiki_path
  wr = textacy.corpora.wiki_reader.WikiReader(wiki_path)
  docs = wr.records()
  for record in docs:  # parsed pages
    record['text'] = ' '.join(section['text'] for section in record['sections'])
    print record['text']
  content_stream, metadata_stream = textacy.fileio.split_record_fields(docs, 'sections.text')
  corpus = textacy.Corpus('en', texts=content_stream, metadata=metadata_stream)
  
  return corpus


def find_keywords(corpus, search_terms):
  return None
  #keywords = textacy.keyterms.key_terms_from_semantic_network(wr, **search_terms)
  #print keywords

if __name__ == "__main__":
  from sys import argv
  print "here"
  kwargs = ["zoo", "mammals"]
  corpus = setup_corpus()
  find_keywords(corpus, kwargs)
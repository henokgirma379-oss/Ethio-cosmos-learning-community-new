alter table public.page_content
  drop constraint if exists page_content_page_section_unique;

alter table public.page_content
  add constraint page_content_page_section_unique unique (page, section);
